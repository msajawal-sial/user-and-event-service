import { IsNotEmpty } from "class-validator";

class UpdateEventJoinRequestDto {
    @IsNotEmpty()
    status: 'ACCEPTED' | 'REJECTED';
}

export default UpdateEventJoinRequestDto;