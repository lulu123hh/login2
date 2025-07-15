# Login

Este proyecto fue generado utilizando [Angular CLI](https://github.com/angular/angular-cli) versión 20.1.0.

## Contenido del Proyecto

### Sistema de Autenticación
- Login y Registro: IIntegrado con API https://api.escuelajs.co/api/v1/users
  
![Login Form](https://github.com/lulu123hh/imagenes/blob/7c167d90d7e95d9f2c8fa42288a427dbab639308/imagen1.png)

### Dashboard
- Nos redirige al portal de administarción en el cual los usuarios del sistema pueden gestionar su cuenta y un explorador de los personajes de Rick & Morty.
  
![Login Form](https://github.com/lulu123hh/imagenes/blob/7c167d90d7e95d9f2c8fa42288a427dbab639308/imagen2.png)

- Tambien se muestra el perfil del usuario
  
![Login Form](https://github.com/lulu123hh/imagenes/blob/7c167d90d7e95d9f2c8fa42288a427dbab639308/imagen3.png)

### Perfil de usuario
- Muestra a detalle la informacion del usuario
  
![Login Form](https://github.com/lulu123hh/imagenes/blob/7c167d90d7e95d9f2c8fa42288a427dbab639308/imagen4.png) 
![Login Form](https://github.com/lulu123hh/imagenes/blob/7c167d90d7e95d9f2c8fa42288a427dbab639308/imagen5.png)

### Explorador para los personajes de Rick & Morty
- El cual esta integrado con la API de Rick & Morty https://rickandmortyapi.com/api/character
- Nos muestra los 826 personajes 
- En el cual se puede agregar personajes, tambien tiene un buscador, y nos muestra una tabla en la cual se refleja el avatar, id, nombre, estado, especie, genero, ubicación y acciones.
- En las acciones podemos visualizar a detalle la informacion del persoje, editar y eliminar.
  
![Login Form](https://github.com/lulu123hh/imagenes/blob/7c167d90d7e95d9f2c8fa42288a427dbab639308/imagen6.png)
- Tambien tiene una paginacion en el cual se muestra de 20 personajes.
  
![Login Form](https://github.com/lulu123hh/imagenes/blob/7c167d90d7e95d9f2c8fa42288a427dbab639308/imagen7.png) 

## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos fuente.

## Generación de código

Angular CLI incluye potentes herramientas de generación de código. Para generar un nuevo componente, ejecuta:

```bash
ng generate component component-name
```

Para obtener una lista completa de los esquemas disponibles (como `componentes`, `directivas`, o `pipes`), ejecuta:

```bash
ng generate --help
```

## Construcción

Para construir el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de construcción en el directorio `dist/` Por defecto, la construcción de producción optimiza tu aplicación para rendimiento y velocidad.

## Ejecución de pruebas unitarias

Para ejecutar pruebas unitarias con el corredor de pruebas [Karma](https://karma-runner.github.io) utiliza el siguiente comando:

```bash
ng test
```

## Ejecución de pruebas de extremo a extremo

Para pruebas de extremo a extremo (e2e), ejecuta:

```bash
ng e2e
```

Angular CLI no incluye un marco de pruebas de extremo a extremo por defecto. Puedes elegir uno que se adapte a tus necesidades.

## Recursos adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página de [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
