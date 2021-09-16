import { VerifiablePresentation } from '@veramo/core';
import { ForvaltServiceImpl } from '../domain/ForvaltUseCase';
import { ForvaltRepositoryImpl } from '../domain/ForvaltRepository';

export function registerForvalt(vp: VerifiablePresentation) {
	let forvaltRepo = new ForvaltRepositoryImpl()
	let forvaltService = new ForvaltServiceImpl(forvaltRepo);

	return forvaltService.registerVpInForvalt(vp)
}