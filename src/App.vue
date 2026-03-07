<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/analytics">Analytics</router-link> |
    <router-link to="/list">List</router-link> |
    <router-link to="/about">About</router-link>

  </nav>

  <router-view />
</template>

<style>
nav {
  padding: 1rem;
}
nav a {
  margin-right: 0.5rem;
}
</style>
