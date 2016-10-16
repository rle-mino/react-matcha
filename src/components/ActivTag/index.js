import React			from 'react';
import { Link }			from 'react-router';
import FontAwesome		from 'react-fontawesome';

import './activTag.sass';

export default ({ tag, remove, editable, linkable }) =>
	<li className="validTag">
		{(linkable && <Link to={`/matcha/search?tag=${tag}`}>{tag}</Link>) || <p>{tag}</p>}
		{editable && <FontAwesome name="times" onClick={remove} className="removeTag"/>}
	</li>
