import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { Meet, MeetDocument } from './schemas/meet.schema';
import { UserService } from 'src/user/user.service';
import { GetMeetDto } from './dtos/getmeet.dto';
import { CreateMeetDto } from './dtos/createMeet.dto';
import { generateLink } from './helpers/linkgenerator.helper';
import { MeetObject, MeetObjectDocument } from './schemas/meetobject.schema';
import { UpdateMeetDto } from './dtos/updatemeet.dto';
import { MeetMessagesHelper } from './helpers/meetmessages.helper';

@Injectable()
export class MeetService {
    private readonly logger = new Logger(MeetService.name)
    // nome da classe pq estou pegando o nome da classe?
    constructor(
        @InjectModel(Meet.name) private readonly model: Model<MeetDocument>,
        @InjectModel(MeetObject.name) private readonly objectModel: Model<MeetObjectDocument>,
        private readonly userService: UserService
        // vou precisar do userService que esta fora do meet pasta, 
        // so importa no meetModule para q o meetservice consiga
    ) { }

    async getMeetsByUser(userId: string) {
        this.logger.debug('getMeetsByUser - ' + userId)
        return await this.model.find({
            user: userId
        })
    }

    async createMeet(userId: string, dto: CreateMeetDto) {
        this.logger.debug('createMeet - ' + userId)

        const user = await this.userService.getUserById(userId)

        const meet = {
            ...dto,
            user,
            link: generateLink()
        }

        const createdMeet = new this.model(meet)
        return await createdMeet.save()
    }


    async deleteMeetByUser(userId: string, meetId: string) {
        this.logger.debug(`deleteMeetByUser - ${userId} - ${meetId}`)
        return await this.model.deleteOne({
            user: userId, _id: meetId
        })

    }


    async getMeetObjects(meetId: String, userId: string) {
        this.logger.debug(`getMeetObjects - ${userId} - ${meetId}`)
        const user = await this.userService.getUserById(userId)
        const meet = await this.model.findOne({ user, _id: meetId })

        return await this.objectModel.find({ meet })
    }

    async update(meetId: string, userId: string, dto: UpdateMeetDto) {
        // id da reuniao id do usuario dados de cada um dos elementos que seram preciso
        // buscamos o usuario para ssim depois buscar a meet deste usuario
     
        this.logger.debug(`update - ${userId} - ${meetId}`)
        const user = await this.userService.getUserById(userId)
        const meet = await this.model.findOne({ user, _id: meetId })

        //return   await this.objectModel.find({meet})

        if (!meet) {
            throw new BadRequestException(MeetMessagesHelper.UPDATE_MEET_NOT_FOUND)
        }
        // se a meet nao pertencer a esse usario passe um badrequest

        meet.name = dto.name
        meet.color = dto.color
        // altera os dados da meet
        await this.model.findByIdAndUpdate({ _id: meetId }, meet)

        await this.objectModel.deleteMany({ meet }) // remove objetos anteriores

        let objectPayload

        for (const object of dto.objects) { // percorre todos objectos atuais 
            objectPayload = {
                meet,
                ...object
            }

            await this.objectModel.create(objectPayload) // cria um novo objeto
        }

    }
}
