import { t } from 'elysia';
import { AbstractEndpoint } from '../classes/AbstractEndpoint.ts';
import { ErrorHandler } from '../classes/ErrorHandler.ts';
import { ErrorCode } from '../types/ErrorHandler.ts';
import { DocumentUtils } from '../utils/DocumentUtils.ts';

export class AccessV1 extends AbstractEndpoint {
	protected override run(): void {
		this.SERVER.elysia.get(
			this.PREFIX.concat('/:key'),
			async ({ params }) => {
				DocumentUtils.validateKey(params.key);

				const file = await DocumentUtils.retrieveDocument(params.key);
				const document = await DocumentUtils.documentReadV1(file);

				// V1 does not support SSE (Server-Side Encryption)
				if (document.header.sse) {
					ErrorHandler.send(ErrorCode.documentSecretNeeded);
				}

				const data = Buffer.from(Bun.inflateSync(document.data)).toString();

				return { key: params.key, data: data };
			},
			{
				params: t.Object({
					key: t.String({
						description: 'The document key',
						examples: ['abc123']
					})
				}),
				response: {
					200: t.Object(
						{
							key: t.String({
								description: 'The key of the document',
								examples: ['abc123']
							}),
							data: t.String({
								description: 'The document',
								examples: ['Hello, World!']
							})
						},
						{ description: 'The document object' }
					),
					400: ErrorHandler.SCHEMA,
					404: ErrorHandler.SCHEMA
				},
				detail: { summary: 'Get document', tags: ['v1'], deprecated: true }
			}
		);
	}
}
