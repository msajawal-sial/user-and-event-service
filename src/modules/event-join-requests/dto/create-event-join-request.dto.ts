import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventJoinRequestDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    eventId: number;
}