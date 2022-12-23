import { IsString } from 'class-validator';

export class ConfirmRequestDto {
  @IsString()
  code: string;

  @IsString()
  name: string;
}
