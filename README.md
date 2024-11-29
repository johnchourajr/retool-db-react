# @muybuen/retool-db-react

<img width="1200" alt="og" src="https://github.com/user-attachments/assets/b7d52c88-5336-40f6-8d42-644afaf8f2b6">

----

A TypeScript first React hook for working with Retool PostgreSQL databases in Next.js applications.

## Installation

```bash
npm install @muybuen/retool-db-react
```

## Usage

### Using in Next.js App Router

1. Add your database URL to environment:
```env
RETOOL_DATABASE_URL=postgresql://user:password@host:port/database
```

2. Create API route handler:
```typescript
// app/api/retool-db/[tableName]/route.ts
import { retoolDbHandler } from '@muybuen/retool-db-react/server';

export { retoolDbHandler as POST, retoolDbHandler as PUT, retoolDbHandler as DELETE };
```

3. Generate types:
```bash
npx retool-db-types --url=$RETOOL_DATABASE_URL
```

### Client Components

```typescript
import { useRetoolDatabase } from '@muybuen/retool-db-react';
import { Users } from './types';

// Basic Query
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

// Custom Query
function ActiveUsers() {
  const { data } = useRetoolDatabase<Users>('users', {
    query: 'SELECT * FROM users WHERE status = $1',
    params: ['active'],
    limit: 50
  });
}

// Mutations
function UserForm() {
  const { insert, update, remove } = useRetoolDatabase<Users>('users');

  const addUser = () => insert({ name: 'John', email: 'john@example.com' });
  const updateUser = (id: number) => update({ id }, { name: 'Jane' });
  const deleteUser = (id: number) => remove({ id });
}
```

### Server Components

```typescript
import { queryRetoolDatabase } from '@muybuen/retool-db-react/server';

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

### Type Generation

```bash
# All tables
npx retool-db-types --url=your_database_url

# Specific table
npx retool-db-types --url=your_database_url --table=users

# Custom output directory
npx retool-db-types --url=your_database_url --output=./src/types
```

## Type Properties

```typescript
interface RetoolDatabaseOptions {
  query?: string;      // Custom SQL query
  params?: unknown[];  // Query parameters
  limit?: number;      // Result limit
}

interface RetoolDatabaseConfig {
  baseUrl?: string;    // Custom API base URL
}

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

This project is maintained by John Choura. See [CONTRIBUTORS](https://github.com/johnchourajr/retool-db-react/blob/main/CONTRIBUTORS.md) for contributing guidelines.

## License

[MIT](LICENSE)