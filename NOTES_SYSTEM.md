# Notes System Documentation

## Overview
The notes system has been updated to store notes in the database instead of localStorage. This ensures that notes persist across different browsers and devices for each user.

## Database Structure

### Notes Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `title` - Note title (string, max 255 characters)
- `content` - Note content (text)
- `created_at` - Timestamp when note was created
- `updated_at` - Timestamp when note was last updated

## API Endpoints

### Authentication Required
All notes endpoints require authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_auth_token}
```

### 1. Get All Notes
**GET** `/api/notes`
- Returns all notes for the authenticated user
- Notes are ordered by creation date (newest first)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "My Note",
      "content": "Note content here",
      "created_at": "2025-01-31T10:30:00.000000Z",
      "updated_at": "2025-01-31T10:30:00.000000Z",
      "date_formatted": "Jan 31, 2025, 10:30 AM"
    }
  ]
}
```

### 2. Create Note
**POST** `/api/notes`
- Creates a new note for the authenticated user

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note saved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Note Title",
    "content": "Note content",
    "created_at": "2025-01-31T10:30:00.000000Z",
    "updated_at": "2025-01-31T10:30:00.000000Z"
  }
}
```

### 3. Update Note
**PUT/PATCH** `/api/notes/{id}`
- Updates an existing note (only if owned by authenticated user)

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### 4. Delete Note
**DELETE** `/api/notes/{id}`
- Deletes a note (only if owned by authenticated user)

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

## Frontend Integration

### Loading Notes
The frontend automatically loads notes when the WeeklyReport component mounts:

```javascript
const loadNotesFromDatabase = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const response = await fetch('/api/notes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setSavedNotes(data.data);
      }
    }
  } catch (error) {
    console.error('Error loading notes:', error);
  }
};
```

### Saving Notes
Notes are saved to the database when the user clicks "Save Note":

```javascript
const handleSaveNote = async () => {
  // Validation
  if (!noteTitle.trim() || !notes.trim()) {
    alert('Please enter both a title and notes content.');
    return;
  }

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to save notes.');
      return;
    }

    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: noteTitle.trim(),
        content: notes.trim(),
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      await loadNotesFromDatabase(); // Reload notes
      setNoteTitle('');
      setNotes('');
      alert('Note saved successfully!');
    } else {
      alert(data.message || 'Failed to save note.');
    }
  } catch (error) {
    console.error('Error saving note:', error);
    alert('Failed to save note. Please try again.');
  }
};
```

### Deleting Notes
Notes are deleted from the database when the user clicks the delete button:

```javascript
const handleDeleteNote = async (noteId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to delete notes.');
      return;
    }

    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      await loadNotesFromDatabase(); // Reload notes
      alert('Note deleted successfully!');
    } else {
      alert(data.message || 'Failed to delete note.');
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    alert('Failed to delete note. Please try again.');
  }
};
```

## Benefits of Database Storage

1. **Cross-browser persistence**: Notes are available on any browser/device
2. **User-specific**: Each user only sees their own notes
3. **Secure**: Notes are protected by authentication
4. **Backup**: Notes are stored in the database and can be backed up
5. **Scalable**: Can handle large numbers of notes per user

## Error Handling

The system includes comprehensive error handling:
- Validation errors for missing or invalid data
- Authentication errors for unauthorized access
- Server errors with appropriate user feedback
- Network errors with retry suggestions

## Security Features

- **Authentication required**: All endpoints require valid auth token
- **User isolation**: Users can only access their own notes
- **Input validation**: All inputs are validated and sanitized
- **SQL injection protection**: Uses Laravel's Eloquent ORM 