export default (e) => {
    e.persist();
		const size = 5
		const rect = e.target.getBoundingClientRect();
		const circle = document.createElement('div');
		circle.style.left = `${e.clientX - rect.left}px`;
		circle.style.top = `${e.clientY - rect.top}px`;
		circle.style.width = circle.style.height = `${size}px`;
		circle.className = 'rippled';
		e.target.appendChild(circle);
		setTimeout(() => {
			e.target.removeChild(circle);
		}, 500);
}