import { ConvexError } from 'convex/values';
import { Effect } from 'effect';

export async function runEffect<Result, Error>(
	effect: Effect.Effect<Result, Error, never>
): Promise<Result> {
	try {
		return await Effect.runPromise(effect);
	} catch (e) {
		const error = e as { _tag?: string };
		if (error?._tag) {
			throw new ConvexError({
				tag: String(error._tag),
				data: error as Record<string, string | number | boolean | null>
			});
		}
		throw error;
	}
}
