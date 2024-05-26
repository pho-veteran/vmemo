const storedTheme = localStorage.getItem('theme');
const systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (systemThemeIsDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', initialTheme);

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

export { toggleTheme };