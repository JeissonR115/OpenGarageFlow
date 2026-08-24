'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

type Mode = 'login' | 'register' | 'user';
type Role = { id: string; name: string };
type Context = {
  user: { id: string; username: string };
  employee: { firstName: string; lastName: string };
  branch: { name: string };
  company: { name: string };
  roles: Role[];
};
type LoginResult = { accessToken: string; user: { id: string; username: string } };
type ApiError = { message?: string | string[] };

const apiBase = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/v1`;
const emptyRegister = {
  companyName: '',
  legalName: '',
  taxId: '',
  branchName: '',
  firstName: '',
  lastName: '',
  username: '',
  password: '',
};
const emptyUser = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  roleIds: [] as string[],
};

export default function Home() {
  const [mode, setMode] = useState<Mode>('login');
  const [token, setToken] = useState(() =>
    typeof window === 'undefined' ? '' : (window.localStorage.getItem('garageflow_token') ?? ''),
  );
  const [context, setContext] = useState<Context | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [login, setLogin] = useState({ identifier: '', password: '' });
  const [register, setRegister] = useState(emptyRegister);
  const [user, setUser] = useState(emptyUser);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    });
    const body: unknown = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiError = body as ApiError;
      const detail = Array.isArray(apiError.message)
        ? apiError.message.join(', ')
        : apiError.message;
      throw new Error(detail ?? 'The request could not be completed.');
    }
    return body as T;
  }

  const loadWorkspace = useCallback(async (accessToken: string) => {
    try {
      const [current, availableRoles] = await Promise.all([
        request<Context>('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } }),
        request<Role[]>('/core/roles'),
      ]);
      setContext(current);
      setRoles(availableRoles);
    } catch {
      window.localStorage.removeItem('garageflow_token');
      setToken('');
    }
  }, []);

  useEffect(() => {
    if (token) queueMicrotask(() => void loadWorkspace(token));
  }, [loadWorkspace, token]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run(async () => {
      const result = await request<LoginResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(login),
      });
      window.localStorage.setItem('garageflow_token', result.accessToken);
      setToken(result.accessToken);
      await loadWorkspace(result.accessToken);
      setMessage('Welcome back.');
    });
  }

  async function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run(async () => {
      const result = await request<LoginResult>('/auth/register-company', {
        method: 'POST',
        body: JSON.stringify(register),
      });
      window.localStorage.setItem('garageflow_token', result.accessToken);
      setToken(result.accessToken);
      await loadWorkspace(result.accessToken);
      setMessage('Company created. Your workspace is ready.');
    });
  }

  async function submitUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run(async () => {
      await request<unknown>('/core/users/with-employee', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(user),
      });
      setUser(emptyUser);
      setMessage('User created successfully.');
    });
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }
  function logout() {
    window.localStorage.removeItem('garageflow_token');
    setToken('');
    setContext(null);
    setMode('login');
  }

  return (
    <main className="shell">
      <section className="intro-panel">
        <div className="brand-mark">OF</div>
        <div>
          <p className="eyebrow">Open Garage Flow</p>
          <h1>Run your workshop with a clearer view.</h1>
          <p className="intro-copy">
            One calm workspace for your company, team, and daily operations.
          </p>
        </div>
        <div className="signal-list">
          <span>
            <i /> Company context included
          </span>
          <span>
            <i /> Team access in one place
          </span>
          <span>
            <i /> Secure sign in
          </span>
        </div>
      </section>
      <section className="workspace-panel">
        <div className="topline">
          <span className="status-dot" />
          <span>Workspace access</span>
          {context && (
            <button className="text-button" onClick={logout}>
              Sign out
            </button>
          )}
        </div>
        {context ? (
          <Dashboard
            context={context}
            roles={roles}
            mode={mode}
            setMode={setMode}
            user={user}
            setUser={setUser}
            busy={busy}
            submitUser={submitUser}
          />
        ) : (
          <AuthForms
            mode={mode}
            setMode={setMode}
            login={login}
            setLogin={setLogin}
            register={register}
            setRegister={setRegister}
            busy={busy}
            submitLogin={submitLogin}
            submitRegister={submitRegister}
          />
        )}
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </section>
    </main>
  );
}

function AuthForms({
  mode,
  setMode,
  login,
  setLogin,
  register,
  setRegister,
  busy,
  submitLogin,
  submitRegister,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
  login: { identifier: string; password: string };
  setLogin: (value: { identifier: string; password: string }) => void;
  register: typeof emptyRegister;
  setRegister: (value: typeof emptyRegister) => void;
  busy: boolean;
  submitLogin: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  submitRegister: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <div className="auth-card">
      <div className="auth-heading">
        <p className="eyebrow">{mode === 'register' ? 'New workspace' : 'Welcome back'}</p>
        <h2>
          {mode === 'register' ? 'Create your company account.' : 'Sign in to your workspace.'}
        </h2>
      </div>
      <div className="tabs">
        <button
          className={mode === 'login' ? 'tab active' : 'tab'}
          onClick={() => setMode('login')}
        >
          Sign in
        </button>
        <button
          className={mode === 'register' ? 'tab active' : 'tab'}
          onClick={() => setMode('register')}
        >
          Register company
        </button>
      </div>
      {mode === 'login' ? (
        <form className="form" onSubmit={(event) => void submitLogin(event)}>
          <Field
            label="Username or email"
            value={login.identifier}
            onChange={(value) => setLogin({ ...login, identifier: value })}
            required
          />
          <Field
            label="Password"
            type="password"
            value={login.password}
            onChange={(value) => setLogin({ ...login, password: value })}
            required
          />
          <SubmitButton label="Enter workspace" busy={busy} />
        </form>
      ) : (
        <form className="form" onSubmit={(event) => void submitRegister(event)}>
          <FormHeading
            title="Company details"
            detail="Set up your first branch and administrator."
          />
          <div className="form-grid">
            {[
              ['Company name', 'companyName'],
              ['Legal name', 'legalName'],
              ['Tax ID', 'taxId'],
              ['First branch', 'branchName'],
              ['Admin first name', 'firstName'],
              ['Admin last name', 'lastName'],
              ['Username', 'username'],
              ['Password', 'password'],
            ].map(([label, key]) => (
              <Field
                key={key}
                label={label}
                type={key === 'password' ? 'password' : 'text'}
                value={register[key as keyof typeof emptyRegister]}
                onChange={(value) => setRegister({ ...register, [key]: value })}
                required
              />
            ))}
          </div>
          <SubmitButton label="Create company" busy={busy} />
        </form>
      )}
    </div>
  );
}

function Dashboard({
  context,
  roles,
  mode,
  setMode,
  user,
  setUser,
  busy,
  submitUser,
}: {
  context: Context;
  roles: Role[];
  mode: Mode;
  setMode: (mode: Mode) => void;
  user: typeof emptyUser;
  setUser: (value: typeof emptyUser) => void;
  busy: boolean;
  submitUser: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <div className="dashboard">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">{context.company.name}</p>
          <h2>Good to see you, {context.employee.firstName}.</h2>
          <p className="muted">
            {context.branch.name} / {context.user.username}
          </p>
        </div>
        <div className="avatar">
          {context.employee.firstName[0]}
          {context.employee.lastName[0]}
        </div>
      </div>
      <div className="action-grid">
        <button
          className={mode === 'user' ? 'action-card active' : 'action-card'}
          onClick={() => setMode('user')}
        >
          <strong>+ Add team member</strong>
          <span>Create an employee and login in one step.</span>
        </button>
        <div className="info-card">
          <span>Your roles</span>
          <div className="role-list">
            {context.roles.map((role) => (
              <b key={role.id}>{role.name}</b>
            ))}
          </div>
        </div>
      </div>
      {mode === 'user' && (
        <form className="form" onSubmit={(event) => void submitUser(event)}>
          <FormHeading
            title="New team member"
            detail="The new employee joins your current branch."
          />
          <div className="form-grid">
            <Field
              label="First name"
              value={user.firstName}
              onChange={(value) => setUser({ ...user, firstName: value })}
              required
            />
            <Field
              label="Last name"
              value={user.lastName}
              onChange={(value) => setUser({ ...user, lastName: value })}
              required
            />
            <Field
              label="Email"
              type="email"
              value={user.email}
              onChange={(value) => setUser({ ...user, email: value })}
            />
            <Field
              label="Phone"
              value={user.phone}
              onChange={(value) => setUser({ ...user, phone: value })}
            />
            <Field
              label="Username"
              value={user.username}
              onChange={(value) => setUser({ ...user, username: value })}
              required
            />
            <Field
              label="Password"
              type="password"
              value={user.password}
              onChange={(value) => setUser({ ...user, password: value })}
              required
            />
          </div>
          <RolePicker
            roles={roles}
            selected={user.roleIds}
            onChange={(roleIds) => setUser({ ...user, roleIds })}
          />
          <SubmitButton label="Create user" busy={busy} />
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}
function FormHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="form-heading">
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}
function RolePicker({
  roles,
  selected,
  onChange,
}: {
  roles: Role[];
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <fieldset className="role-picker">
      <legend>
        Assign roles <em>*</em>
      </legend>
      <div>
        {roles.map((role) => (
          <label key={role.id} className="role-option">
            <input
              type="checkbox"
              checked={selected.includes(role.id)}
              onChange={() =>
                onChange(
                  selected.includes(role.id)
                    ? selected.filter((id) => id !== role.id)
                    : [...selected, role.id],
                )
              }
            />
            <span>{role.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
function SubmitButton({ label, busy }: { label: string; busy: boolean }) {
  return (
    <button className="submit-button" type="submit" disabled={busy}>
      {busy ? 'Working...' : label}
      <span>-&gt;</span>
    </button>
  );
}
