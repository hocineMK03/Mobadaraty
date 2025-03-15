
## Features

- **User Management**:
  - Two types of users: `AssociationUser` and `VolunteerUser`.
  - `AssociationUser` can manage locations and assign volunteers to them.
  - `VolunteerUser` can register and get assigned to specific tasks or locations.

- **Location Management**:
  - Associations can define multiple locations, each with coordinates, required volunteers, and assigned volunteers.

- **Task Management**:
  - Tasks can be assigned to volunteers with statuses (pending, in_progress, completed).
  - Each task has a due date and can be tracked by its current status.

- **Volunteer Assignment**:
  - Volunteers can be assigned to specific locations and tasks based on their skills and availability.

## Technologies Used

- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **MongoDB (Mongoose)** - Database and ORM
- **JWT Authentication** - For secure authentication


