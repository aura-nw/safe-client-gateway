import { JSONSchemaType } from 'ajv';
import { EventType } from '../event-payload.entity';
import { ModuleTransaction } from '../module-transaction.entity';

export const MODULE_TRANSACTION_EVENT_SCHEMA_ID =
  'https://safe-client.safe.global/schemas/cache-hooks/module-transaction.json';

export const moduleTransactionEventSchema: JSONSchemaType<ModuleTransaction> = {
  $id: MODULE_TRANSACTION_EVENT_SCHEMA_ID,
  type: 'object',
  properties: {
    address: { type: 'string' },
    chainId: { type: 'string' },
    type: { type: 'string', const: EventType.MODULE_TRANSACTION },
    module: { type: 'string' },
    txHash: { type: 'string' },
  },
  required: ['address', 'chainId', 'type', 'module', 'txHash'],
};
