import { Color } from '../math/Color.js';

class Fog {

	constructor( color, near = 1, far = 1000 ) {

		this.name = '';

		this.color = new Color( color );

		this.near = near;
		this.far = far;

	}

	clone() {

		return new Fog( this.color, this.near, this.far );

	}

}

Fog.prototype.isFog = true;

export { Fog };
