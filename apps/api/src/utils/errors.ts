import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty()
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
