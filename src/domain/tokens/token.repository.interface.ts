import { Page } from '../entities/page.entity';
import { Token } from './entities/token.entity';

export const ITokenRepository = Symbol('ITokenRepository');

export interface ITokenRepository {
  getToken(args: { chainId: string; address: string }): Promise<Token>;

  getTokens(args: {
    chainId: string;
    limit?: number;
    offset?: number;
  }): Promise<Page<Token>>;
}
