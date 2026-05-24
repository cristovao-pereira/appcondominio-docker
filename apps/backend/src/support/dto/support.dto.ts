import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class SupportDto {
  @IsString({ message: 'O nome deve ser uma cadeia de caracteres.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @Length(2, 80, { message: 'O nome deve ter entre 2 e 80 caracteres.' })
  @Matches(/^[^<>]*$/, { message: 'O nome não deve conter tags HTML ou caracteres especiais como < e >.' })
  name!: string;

  @IsEmail({}, { message: 'Por favor, forneça um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @Length(5, 100, { message: 'O e-mail deve ter entre 5 e 100 caracteres.' })
  email!: string;

  @IsString({ message: 'O assunto deve ser uma cadeia de caracteres.' })
  @IsNotEmpty({ message: 'O assunto é obrigatório.' })
  @Length(3, 100, { message: 'O assunto deve ter entre 3 e 100 caracteres.' })
  @Matches(/^[^<>]*$/, { message: 'O assunto não deve conter tags HTML ou caracteres especiais como < e >.' })
  subject!: string;

  @IsString({ message: 'A mensagem deve ser uma cadeia de caracteres.' })
  @IsNotEmpty({ message: 'A mensagem é obrigatória.' })
  @Length(10, 1000, { message: 'A mensagem deve ter entre 10 e 1000 caracteres.' })
  @Matches(/^[^<>]*$/, { message: 'A mensagem não deve conter tags HTML. Por favor, envie apenas texto plano.' })
  message!: string;
}
