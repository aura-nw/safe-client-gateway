import { Inject, Injectable } from '@nestjs/common';
import { Page } from '../entities/page.entity';
import { ITransactionApiManager } from '../interfaces/transaction-api.manager.interface';
import { Message } from './entities/message.entity';
import { MessageValidator } from './message.validator';
import { IMessagesRepository } from './messages.repository.interface';

@Injectable()
export class MessagesRepository implements IMessagesRepository {
  constructor(
    @Inject(ITransactionApiManager)
    private readonly transactionApiManager: ITransactionApiManager,
    private readonly messageValidator: MessageValidator,
  ) {}

  async getMessageByHash(args: {
    chainId: string;
    messageHash: string;
  }): Promise<Message> {
    const transactionService =
      await this.transactionApiManager.getTransactionApi(args.chainId);
    const message = await transactionService.getMessageByHash(args.messageHash);
    return this.messageValidator.validate(message);
  }

  async getMessagesBySafe(args: {
    chainId: string;
    safeAddress: string;
    limit?: number | undefined;
    offset?: number | undefined;
  }): Promise<Page<Message>> {
    const transactionService =
      await this.transactionApiManager.getTransactionApi(args.chainId);
    const page = await transactionService.getMessagesBySafe({
      safeAddress: args.safeAddress,
      limit: args.limit,
      offset: args.offset,
    });

    return this.messageValidator.validatePage(page);
  }

  async createMessage(args: {
    chainId: string;
    safeAddress: string;
    message: unknown;
    safeAppId: number | null;
    signature: string;
  }): Promise<unknown> {
    const transactionService =
      await this.transactionApiManager.getTransactionApi(args.chainId);

    return transactionService.postMessage({
      safeAddress: args.safeAddress,
      message: args.message,
      safeAppId: args.safeAppId,
      signature: args.signature,
    });
  }

  async updateMessageSignature(args: {
    chainId: string;
    messageHash: string;
    signature: string;
  }): Promise<unknown> {
    const transactionService =
      await this.transactionApiManager.getTransactionApi(args.chainId);

    return transactionService.postMessageSignature({
      messageHash: args.messageHash,
      signature: args.signature,
    });
  }

  async clearMessagesBySafe(args: {
    chainId: string;
    safeAddress: string;
  }): Promise<void> {
    const api = await this.transactionApiManager.getTransactionApi(
      args.chainId,
    );
    await api.clearMessagesBySafe(args);
  }

  async clearMessagesByHash(args: {
    chainId: string;
    messageHash: string;
  }): Promise<void> {
    const api = await this.transactionApiManager.getTransactionApi(
      args.chainId,
    );
    await api.clearMessagesByHash(args);
  }
}
