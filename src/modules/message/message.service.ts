import { Injectable } from '@nestjs/common';
import { Message } from "./message.entity";

@Injectable()
export class MessageService {

  async createMessage(message: Message) {

    const MessageModel = new Message().getModelForClass(Message);
    const messageDocument = new MessageModel(message);
    messageDocument.save();
    await messageDocument.populate('author', 'nickname').execPopulate();

    return messageDocument;

  }

}
