import { Object3D } from '../core/Object3D.js';
import { Color } from '../math/Color.js';

class Light extends Object3D {

	constructor( color, intensity = 1 ) {

		super();

		this.type = 'Light';

		this.color = new Color( color );
		this.intensity = intensity;

	}

	dispose() {

		// Empty here in base class; some subclasses override.

	}

	copy( source ) {

		super.copy( source );

		this.color.copy( source.color );
		this.intensity = source.intensity;

		return this;

	}

}

Light.prototype.isLight = true;

export { Light };
