function toggleMenu() {
  const navbarMenu = document.querySelector(".navbar-menu");
  const navbarBackdrop = document.querySelector(".navbar-backdrop");
  navbarMenu.classList.toggle("active");
  navbarBackdrop.classList.toggle("active");
}