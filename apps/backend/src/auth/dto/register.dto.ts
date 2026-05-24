import { IsEmail, IsNotEmpty, IsString, Length, Matches, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Por favor, forneça um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @Length(5, 100, { message: 'O e-mail deve ter entre 5 e 100 caracteres.' })
  email!: string;

  @IsString({ message: 'O nome deve ser uma cadeia de caracteres.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @Length(2, 80, { message: 'O nome deve ter entre 2 e 80 caracteres.' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'O nome deve conter apenas letras e espaços.' })
  name!: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @Length(8, 50, { message: 'A senha deve ter entre 8 e 50 caracteres.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@$!%*?&).',
    },
  )
  password!: string;

  @IsOptional()
  @IsString()
  @IsIn(['resident', 'admin'], { message: 'Papel do usuário inválido.' })
  role?: string;
}
