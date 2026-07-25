import { Body, Controller, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Validate a user by username or email' })
  @ApiOkResponse({ description: 'User validated successfully.' })
  @ApiNotFoundResponse({ description: 'User was not found.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.validateUser(loginDto.identifier, loginDto.password);
  }
}
