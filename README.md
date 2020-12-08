# Gilly
Personal monorepo for all my projects

Uses [Nx](https://nx.dev/) for manging the mono. Follow their guide for installation instructions.

## Applications 

### [Dakimbo Server](https://github.com/PaddingtonTheBear/gilly/tree/master/apps/dakimbo-server)

Server that powers the backend of all my applications. Utilizes TypeORM for easily defining entities and performing CRUD against a database. Contains a custom Data Controller that effortlessly works with the TypeORM Entities to provide instant REST endpoints for managing the entities, along with pre and post processing. Also contains security features for creating users, logging them in with JWT, and even Role Groups for limiting users to certain actions in the applications or limiting them to certain actions against the entities.

### [Kid Money](https://github.com/PaddingtonTheBear/gilly/tree/master/apps/kid-money)

This app is intended to be used by both parents and their children for managing the children's money (all fake of course!). Transactions can be added for both purchases as well as income (allowances, chores, birthdays, etc.). Pictures can be taken of the transaction so that children can see in the future where their money went, even when they lose that special toy.

## Libraries

### [App Shell](https://github.com/PaddingtonTheBear/gilly/tree/master/libs/app-shell)

This library is intended to encapsulate common functionalities needed across every application, such as Authentication, Metrics, Route Guarding, HTTP Intercepting (HTTPS, etc.). It also contains common components needed for an app to function well, such as a login and error page. It contains a header and page container for styling all pages in the application to be the same. Also, in the ```_styles``` folder is a quick way to apply common styles across all applications.

### [Data](https://github.com/PaddingtonTheBear/gilly/tree/master/libs/data)

The Data library is intended to provide services and components for interacting with data; both sending it between the server and client as well as managing that data in an application. 

To this end, the ```data.service.ts``` class provides a [Dynamic CRUD Service](https://medium.com/@jeffgilliland/creating-a-dynamic-crud-service-in-angular-992229c9be56) for effortlessly interacting with your TypeORM entities from the frontend. It provides generic methods for saving (Create, Update, Delete) and reading data simply by providing an entity class or name. There is also a basic caching mechanism that will store entities that are read in and maintain them when they are modified. Using rxjs, components can subscribe to changes to this cache, essentially mimicking a heavier store solution.

Some components, such as the data importer, provide an easy way for importing data into the system.

### [Entities](https://github.com/PaddingtonTheBear/gilly/tree/master/libs/entities)

The entities library is where everything starts for an application. Here is where you define the underlying data model for your application utilizing TypeORM to define your entities. This will automatically maintain the database tables and provide persistence. The biggest benefit is the handling of relationships (1-1, 1-Many, Many-Many, etc.) along with Tree entity types. Coupled with the [Dakimbo Server](https://github.com/PaddingtonTheBear/gilly/tree/master/apps/dakimbo-server), a REST API for each defined entity is automatically made available.

### [UI-Components](https://github.com/PaddingtonTheBear/gilly/tree/master/libs/ui-components)

UI Components are common components that are used across all applications. Currently, this focus is on the display of data in more complex visualizations. Utilizing Ngx-Swimlane, Leaflet, NgTimeline and some custom components, a suite of visualizations are provided that automatically size to your container and take two input properties, data and displayOptions, to start working.

Other application wide components will be made available in this library in the future.

### [Utilities](https://github.com/PaddingtonTheBear/gilly/tree/master/libs/utilities)

As the name implies, common logic that is utilized across the system are defined in here. From string manipulations (pretty print!) to filtering, sorting and even Role Checking, most commonly re-used logic winds up here.
