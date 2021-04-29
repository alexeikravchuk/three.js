import { BufferGeometry } from './BufferGeometry.js';

class InstancedBufferGeometry extends BufferGeometry {

	constructor() {

		super();

		this.type = 'InstancedBufferGeometry';
		this.instanceCount = Infinity;

	}

	copy( source ) {

		super.copy( source );

		this.instanceCount = source.instanceCount;

		return this;

	}

	clone() {

		return new this.constructor().copy( this );

	}

}

InstancedBufferGeometry.prototype.isInstancedBufferGeometry = true;

export { InstancedBufferGeometry };
