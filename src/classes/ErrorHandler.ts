import { error, t } from 'elysia';
import { ErrorCode, type Schema } from '../types/ErrorHandler.ts';

export class ErrorHandler {
	public static readonly SCHEMA = t.Object(
		{
			type: t.String({ description: 'The message type' }),
			code: t.Integer({ description: 'The message code' }),
			message: t.String({ description: 'The message description' })
		},
		{ description: 'An object representing a message' }
	);

	private static readonly MAP: Record<ErrorCode, Schema> = {
		[ErrorCode.unknown]: {
			httpCode: 500,
			type: 'generic',
			message:
				'An unknown error occurred. This may be due to an unexpected condition in the server. If it happens again, please report it here: https://github.com/jspaste/backend/issues/new/choose'
		},
		[ErrorCode.notFound]: {
			httpCode: 404,
			type: 'generic',
			message: 'The requested resource does not exist.'
		},
		[ErrorCode.validation]: {
			httpCode: 400,
			type: 'generic',
			message:
				'Validation of the request data failed. Check the entered data according to our documentation: https://jspaste.eu/docs'
		},
		[ErrorCode.crash]: {
			httpCode: 500,
			type: 'generic',
			message:
				'An internal server error occurred. This may be due to an unhandled exception. If it happens again, please report it here: https://github.com/jspaste/backend/issues/new/choose'
		},
		[ErrorCode.parse]: {
			httpCode: 400,
			type: 'generic',
			message:
				'The request could not be parsed. This may be due to a malformed input or an unsupported data format. Check the entered data and try again.'
		},
		[ErrorCode.documentNotFound]: {
			httpCode: 404,
			type: 'document',
			message: 'The requested document does not exist. Check the document key and try again.'
		},
		[ErrorCode.documentSecretNeeded]: {
			httpCode: 401,
			type: 'document',
			message: 'This document is protected. Provide the document secret and try again.'
		},
		[ErrorCode.documentInvalidSize]: {
			httpCode: 400,
			type: 'document',
			message: 'The body size provided for the document is too large (or too small).'
		},
		[ErrorCode.documentInvalidSecret]: {
			httpCode: 403,
			type: 'document',
			message: 'The credentials provided for the document are invalid.'
		},
		[ErrorCode.documentInvalidSecretLength]: {
			httpCode: 400,
			type: 'document',
			message: 'The secret length provided for the document is invalid.'
		},
		[ErrorCode.documentInvalidKeyLength]: {
			httpCode: 400,
			type: 'document',
			message: 'The key length provided for the document is out of range.'
		},
		[ErrorCode.documentKeyAlreadyExists]: {
			httpCode: 400,
			type: 'document',
			message: 'The key provided for the document already exists. Use another one and try again.'
		},
		[ErrorCode.documentInvalidKey]: {
			httpCode: 400,
			type: 'document',
			message: 'The key provided for the document is invalid. Use another one and try again.'
		}
	};

	public static get(code: ErrorCode) {
		const { type, message } = ErrorHandler.MAP[code];

		return { type, code, message };
	}

	public static send(code: ErrorCode): void {
		const { httpCode, type, message } = ErrorHandler.MAP[code];

		throw error(httpCode, { type, code, message });
	}
}
