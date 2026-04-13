import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    forgotPassword: jest.fn(),
    logout: jest.fn(),
    getMe: jest.fn(),
    syncProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('health check', () => {
    expect(controller.health()).toEqual({
      status: 'ok',
      service: 'coltrade-auth',
      version: '1.0.0',
    });
  });

  it('should register', async () => {
    const dto = { email: 'test@test.com', password: 'password', role: 'CLIENT' } as any;
    mockAuthService.register.mockResolvedValue('registered');
    expect(await controller.register(dto)).toBe('registered');
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should login', async () => {
    const dto = { email: 'test@test.com', password: 'password' };
    mockAuthService.login.mockResolvedValue('logged_in');
    expect(await controller.login(dto)).toBe('logged_in');
    expect(service.login).toHaveBeenCalledWith(dto);
  });

  it('should refresh token', async () => {
    const dto = { refreshToken: 'rt' };
    mockAuthService.refreshToken.mockResolvedValue('refreshed');
    expect(await controller.refreshToken(dto)).toBe('refreshed');
    expect(service.refreshToken).toHaveBeenCalledWith(dto);
  });

  it('should forgot password', async () => {
    const dto = { email: 'test@test.com' };
    mockAuthService.forgotPassword.mockResolvedValue('forgot');
    expect(await controller.forgotPassword(dto)).toBe('forgot');
    expect(service.forgotPassword).toHaveBeenCalledWith(dto);
  });

  it('should logout', async () => {
    const user = { id: 'u1' } as any;
    mockAuthService.logout.mockResolvedValue('logged_out');
    expect(await controller.logout(user)).toBe('logged_out');
    expect(service.logout).toHaveBeenCalledWith(user.id);
  });

  it('should get me', async () => {
    const user = { id: 'u1' } as any;
    mockAuthService.getMe.mockResolvedValue('me');
    expect(await controller.getMe(user)).toBe('me');
    expect(service.getMe).toHaveBeenCalledWith(user.id);
  });

  it('should sync profile', async () => {
    const user = { id: 'u1', email: 'test@test.com' } as any;
    const dto = { firstName: 'John' } as any;
    mockAuthService.syncProfile.mockResolvedValue('synced');
    expect(await controller.syncProfile(user, dto)).toBe('synced');
    expect(service.syncProfile).toHaveBeenCalledWith(user.id, user.email, dto);
  });
});
