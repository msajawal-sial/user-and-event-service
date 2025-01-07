import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventJoinRequestDto {
    @ApiProperty({
        description: 'New status for the join request',
        enum: ['ACCEPTED', 'REJECTED'],
        example: 'ACCEPTED'
    })
    @IsNotEmpty()
    status: 'ACCEPTED' | 'REJECTED';
}