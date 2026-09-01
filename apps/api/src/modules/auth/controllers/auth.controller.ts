import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { AuthContextResponseDto } from '../dto/auth-context-response.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterCompanyDto } from '../dto/register-company.dto';
import { AuthenticatedUser, JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-company')
  @ApiOperation({ summary: 'Register a company and its administrator' })
  @ApiCreatedResponse({ description: 'Company registered successfully.', type: LoginResponseDto })
  async registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
    return this.authService.registerCompany(registerCompanyDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user by username or email' })
  @ApiOkResponse({ description: 'User authenticated successfully.', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get the authenticated user context' })
  @ApiOkResponse({ description: 'Authenticated context retrieved.', type: AuthContextResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing authentication token.' })
  async me(@Req() request: Request & { user: AuthenticatedUser }) {
    return this.authService.getContext(request.user.sub);
  }
}
