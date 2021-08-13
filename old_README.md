# app_podemosaprender con React y Material UI

## Objetivos

Que cualquier persona pueda crear pantallas aunque sepa poquito.

### Consumir y escribir datos en si.podemosaprender.org

Queremos

- una API Javascript bien simple y que no dependa de React en /services/pa-api.js
- Hook React que la envuelva /hooks/usePaApi.js

TODO: Agregar en pa-api.js funciones como traerCharlas() que escondan las URLs y los parámetros.

### Hacer pantallas

Se puede partir de un ejemplo como /pages/QueHago.jsx

Buscar componentes en https://material-ui.com/components/avatars/

En /src/App.js importar la nueva pantalla y agregarla a las rutas como las otrás


#### Queries

~~~
{ 
charlaitemLista(textoId: "VGV4dG9Ob2RlOjQyNQ==") {
  edges { node { charla { titulo }, orden } }
}
texto(id: "VGV4dG9Ob2RlOjQyNQ==") { texto }
}
~~~

## Tests unitarios

Para testear la aplicación preferimos usar tests end-to-end, que testean desde la pantalla hasta el servidor.

Estos los usamos para desarrollar más rápido testeando funciones y librerías sin tener que pasar por la pantalla.

Se ejecutan con 
~~~
npm run test
~~~

Están en la carpeta src/test

Podés extraer algunas recetas de [el sitio de React](https://reactjs.org/docs/testing-recipes.html)
