import { InterleavedBuffer } from './InterleavedBuffer.js';

class InstancedInterleavedBuffer extends InterleavedBuffer {

	constructor( array, stride, meshPerAttribute = 1 ) {

		super( array, stride );

		this.meshPerAttribute = meshPerAttribute || 1;

	}

	copy( source ) {

		super.copy( source );

		this.meshPerAttribute = source.meshPerAttribute;

		return this;

	}

	clone( data ) {

		const ib = super.clone( data );

		ib.meshPerAttribute = this.meshPerAttribute;

		return ib;

	}

}

InstancedInterleavedBuffer.prototype.isInstancedInterleavedBuffer = true;

export { InstancedInterleavedBuffer };
