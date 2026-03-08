<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/list">List</router-link> |
    <router-link to="/analytics">Analytics</router-link>
  </nav>

  <router-view />

  <footer class="footer">
    <router-link to="/about">About</router-link>
  </footer>
</template>

<style>
nav {
  padding: 1rem;
}

nav a {
  margin-right: 0.5rem;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.8rem;
  text-align: center;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
}
</style>