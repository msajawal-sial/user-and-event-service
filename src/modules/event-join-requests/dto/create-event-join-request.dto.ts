import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventJoinRequestDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;
}