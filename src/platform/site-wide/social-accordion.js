const toggleAccordion = () => {
	const node = document.querySelector('.usa-accordion-bordered');
	const button = node.querySelector('button.usa-accordion-button-dark');
	const content = node.querySelector('.usa-accordion-content');
	const buttonOpen = button.getAttribute('aria-expanded') === "true";
	const contentHidden = content.getAttribute('aria-hidden') === "true";
	button.setAttribute('aria-expanded', !buttonOpen + '');
	content.setAttribute('aria-hidden', !contentHidden + '');
}
document.addEventListener('DOMContentLoaded', () => {
	if(window.innerWidth < 768) { // is Mobile
		toggleAccordion()
	}
})