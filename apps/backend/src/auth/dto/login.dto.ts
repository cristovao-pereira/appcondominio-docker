import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Por favor, forneça um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @Length(5, 100, { message: 'O e-mail deve ter entre 5 e 100 caracteres.' })
  email!: string;

  @IsString({ message: 'A senha é obrigatória.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @Length(6, 50, { message: 'Formato de senha inválido.' })
  password!: string;
}
