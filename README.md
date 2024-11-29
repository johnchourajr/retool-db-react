# @muybuen/retool-db-react

<img width="1200" alt="og" src="https://github.com/user-attachments/assets/b7d52c88-5336-40f6-8d42-644afaf8f2b6">

----

A TypeScript first React hook for working with Retool PostgreSQL databases in Next.js applications.

## Installation

To install the package, run:

```bash
npm install @muybuen/retool-db-react
```

## Usage

### Using in Next.js App Router

1. Add your database URL to your environment variables:

```env
RETOOL_DATABASE_URL=postgresql://user:password@host:port/database
```

2. Create an API route handler:

```typescript
// app/api/retool-db/[tableName]/route.ts
import { retoolDbHandler } from '@muybuen/retool-db-react';

export { retoolDbHandler as POST, retoolDbHandler as PUT, retoolDbHandler as DELETE };
```

3. Generate types for your database tables:

```bash
npx retool-db-types --url=$RETOOL_DATABASE_URL
```

4. Use the hook in your components:


## Usage

### Basic Query

```typescript
import { useRetoolDatabase } from '@muybuen/retool-db-react';
import { Users } from './types';

function UserList() {
  const { data, isLoading, error } = useRetoolDatabase<Users>('users');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Custom Query

```typescript
function ActiveUsers() {
  const { data } = useRetoolDatabase<Users>('users', {
    query: 'SELECT * FROM users WHERE status = $1',
    params: ['active'],
    limit: 50
  });
}
```

### Mutations

```typescript
function UserForm() {
  const { insert, update, remove } = useRetoolDatabase<Users>('users');

  const addUser = async () => {
    await insert({
      name: 'John Doe',
      email: 'john@example.com'
    });
  };

  const updateUser = async (id: number) => {
    await update(
      { id }, // where clause
      { name: 'Jane Doe' } // update data
    );
  };

  const deleteUser = async (id: number) => {
    await remove({ id });
  };
}
```

### Custom Base URL

```typescript
const { data } = useRetoolDatabase<Users>(
  'users',
  { limit: 50 },
  { baseUrl: 'https://api.example.com/retool-db' }
);
```

## Server Usage

### In Server Components

```typescript
import { queryRetoolDatabase } from '@muybuen/retool-db-react/server';

// Server Component
export default async function UsersPage() {
  const users = await queryRetoolDatabase<User>('users', {
    query: 'SELECT * FROM users WHERE active = $1',
    params: [true]
  });

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Hybrid Pattern (Server + Client)

```typescript
// app/users/page.tsx
import { queryRetoolDatabase } from '@muybuen/retool-db-react/server';
import { UserActions } from './actions';

export default async function UsersPage() {
  const users = await queryRetoolDatabase<User>('users');

  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <UserActions />
    </div>
  );
}

// app/users/actions.tsx
"use client";
import { useRetoolDatabase } from '@muybuen/retool-db-react';

export function UserActions() {
  const { insert } = useRetoolDatabase<User>('users');
  return <button onClick={() => insert({ name: 'New User' })}>Add User</button>;
}

## Type Generation

Generate TypeScript types from your database schema using the included CLI:

```bash
# Generate types for all tables
npx retool-db-types --url=your_database_url

# Generate types for a specific table
npx retool-db-types --url=your_database_url --table=users

# Specify output directory
npx retool-db-types --url=your_database_url --output=./src/types
```

### CLI Options

```
Options:
  -u, --url <url>       Database connection URL
  -o, --output <path>   Output directory (default: "./src/types")
  -t, --table <table>   Specific table to generate types for
  -h, --help           Display help information
```

## Type Properties

### Hook Options

```typescript
interface RetoolDatabaseOptions {
  query?: string;      // Custom SQL query
  params?: unknown[];  // Query parameters
  limit?: number;      // Result limit
}

interface RetoolDatabaseConfig {
  baseUrl?: string;    // Custom API base URL
}
```

### Return Values

```typescript
interface RetoolDatabaseReturn<T> {
  data: T[] | null;
  isLoading: boolean;
  error: RetoolDatabaseError | null;
  insert: (data: Partial<T>) => Promise<T>;
  update: (where: Partial<T>, data: Partial<T>) => Promise<T[]>;
  remove: (where: Partial<T>) => Promise<T[]>;
  refetch: () => Promise<void>;
}
```

## Contributing

This project is maintained by John Choura, but it is open to contributions from anyone. See [CONTRIBUTORS](https://github.com/johnchourajr/retool-db-react/blob/main/CONTRIBUTORS.md) for a guide on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/johnchourajr/retool-db-react/blob/main/LICENSE) file for details.



-----



# @muybuen/retool-db-react

A React hook and utilities for easily working with Retool PostgreSQL databases in Next.js applications.

## Features

- 🪝 React hook for fetching and managing database state
- 🔄 CRUD operations with type safety
- 🏃‍♂️ Runtime schema validation with Zod
- 🎯 Automatic TypeScript type generation from your database schema
- 🔐 SQL injection protection
- 📝 Full TypeScript support

## Installation

```bash
npm install @muybuen/retool-db-react
```

## Setup

1. Add your database URL to your environment variables:

```env
RETOOL_DATABASE_URL=postgresql://user:password@host:port/database
```

2. Create an API route in your Next.js app:

```typescript
// app/api/retool-db/[tableName]/route.ts
import { retoolDbHandler } from '@muybuen/retool-db-react';

export { retoolDbHandler as POST, retoolDbHandler as PUT, retoolDbHandler as DELETE };
```

3. Generate types for your database tables:

```bash
npx retool-db-types --url=$RETOOL_DATABASE_URL
```

## Usage

### Basic Query

```typescript
import { useRetoolDatabase } from '@muybuen/retool-db-react';
import { Users } from './types';

function UserList() {
  const { data, isLoading, error } = useRetoolDatabase<Users>('users');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Custom Query

```typescript
function ActiveUsers() {
  const { data } = useRetoolDatabase<Users>('users', {
    query: 'SELECT * FROM users WHERE status = $1',
    params: ['active'],
    limit: 50
  });
}
```

### Mutations

```typescript
function UserForm() {
  const { insert, update, remove } = useRetoolDatabase<Users>('users');

  const addUser = async () => {
    await insert({
      name: 'John Doe',
      email: 'john@example.com'
    });
  };

  const updateUser = async (id: number) => {
    await update(
      { id }, // where clause
      { name: 'Jane Doe' } // update data
    );
  };

  const deleteUser = async (id: number) => {
    await remove({ id });
  };
}
```

### Custom Base URL

```typescript
const { data } = useRetoolDatabase<Users>(
  'users',
  { limit: 50 },
  { baseUrl: 'https://api.example.com/retool-db' }
);
```

## Type Generation

Generate TypeScript types from your database schema using the included CLI:

```bash
# Generate types for all tables
npx retool-db-types --url=your_database_url

# Generate types for a specific table
npx retool-db-types --url=your_database_url --table=users

# Specify output directory
npx retool-db-types --url=your_database_url --output=./src/types
```

## Configuration Options

### Hook Options

```typescript
interface RetoolDatabaseOptions {
  query?: string;      // Custom SQL query
  params?: unknown[];  // Query parameters
  limit?: number;      // Result limit
}

interface RetoolDatabaseConfig {
  baseUrl?: string;    // Custom API base URL
}
```

### CLI Options

```
Options:
  -u, --url <url>       Database connection URL
  -o, --output <path>   Output directory (default: "./src/types")
  -t, --table <table>   Specific table to generate types for
  -h, --help           Display help information
```

## Error Handling

The hook provides detailed error information:

```typescript
interface RetoolDatabaseError {
  message: string;
  code?: string;    // PostgreSQL error code
  detail?: string;  // Detailed error message
}
```

## TypeScript Support

All components and functions are fully typed:

```typescript
function useRetoolDatabase<T>(
  tableName: string,
  options?: RetoolDatabaseOptions,
  config?: RetoolDatabaseConfig
): {
  data: T[] | null;
  isLoading: boolean;
  error: RetoolDatabaseError | null;
  insert: (data: Partial<T>) => Promise<T>;
  update: (where: Partial<T>, data: Partial<T>) => Promise<T[]>;
  remove: (where: Partial<T>) => Promise<T[]>;
  refetch: () => Promise<void>;
};
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
