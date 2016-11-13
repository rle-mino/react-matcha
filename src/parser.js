import _				from 'lodash';

export default (data) => {
	const error = {};
	_.forEach(data, (val) => {
			if (typeof val.value === 'string' && val.name !== 'mail' && val.name !== 'bio') {
				if (val.value.length > 30) error[val.name] = '30 CHARACTERS MAX';
			} else if (typeof val.value === 'string' && val.name === 'mail') {
				if (val.value.length > 100) error[val.name] = '100 CHARACTERS MAX';
			} else if (typeof val.value === 'string' && val.name === 'bio') {
				if (val.value.length > 1000) error[val.name] = '1000 CHARACTERS MAX';
			}
		}
	);
	return (Object.keys(error).length ? error : null);
}