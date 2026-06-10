<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </nav>

    <router-view />
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
}

nav {
  padding: 16px;
  background: #42b883;
}

nav a {
  color: white;
  margin-right: 10px;
  text-decoration: none;
}
</style>