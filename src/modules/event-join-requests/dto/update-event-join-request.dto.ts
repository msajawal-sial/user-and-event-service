import { IsNotEmpty } from "class-validator";

export class UpdateEventJoinRequestDto {
    @IsNotEmpty()
    status: 'ACCEPTED' | 'REJECTED';
}