# Profile Picture Deletion Feature

## Overview

Implemented complete profile picture deletion that:

1. ✅ Deletes the physical image file from the `Backend/uploads` folder
2. ✅ Resets the `avatar_url` field to `null` in the database
3. ✅ Displays the default generated avatar in the app UI

## Changes Made

### Backend Changes

#### 1. `Backend/src/controllers/auth.controller.js`

- **Added imports**: `fs/promises`, `path`, `fileURLToPath` for file system operations
- **Added `deleteAvatar()` function**:
  - Retrieves user's current `avatar_url`
  - Extracts filename from the URL (e.g., `http://localhost:4000/uploads/photo.jpg` → `photo.jpg`)
  - Constructs full file path to `Backend/uploads/filename`
  - Deletes the physical file using `fs.unlink()`
  - Updates user document to set `avatar_url: null`
  - Returns success response with updated user data
  - Includes comprehensive error handling and logging

#### 2. `Backend/src/routes/auth.routes.js`

- **Added route**: `DELETE /api/auth/avatar` (requires authentication)
- **Imported**: `deleteAvatar` controller function

### Frontend Changes

#### 3. `CampusLink-main/lib/api.js`

- **Added `removeAvatar()` function**: Makes DELETE request to `/api/auth/avatar`
- Returns success response with updated user data

#### 4. `CampusLink-main/utils/avatarHelper.js`

- **Added `removeProfileAvatar()` function**:
  - Calls `api.removeAvatar()`
  - Returns success status and updated user object
  - Handles errors gracefully

#### 5. `CampusLink-main/screens/ProfileScreen.js`

- **Updated imports**: Added `removeProfileAvatar` from avatarHelper
- **Updated `handleRemovePhoto()` function**:
  - Now calls `removeProfileAvatar()` instead of just updating database
  - Shows more descriptive alert message
  - Properly handles success/error responses
  - Refreshes profile to display default avatar
  - Includes try/catch error handling

## How It Works

### User Flow:

1. User taps "Remove Photo" in profile screen
2. Alert appears: "Are you sure you want to remove your profile picture? This will delete the image from the server and reset to the default avatar."
3. User confirms deletion
4. Frontend calls `removeProfileAvatar()` → `api.removeAvatar()`
5. Backend receives DELETE request at `/api/auth/avatar`
6. Backend controller:
   - Finds user by ID
   - Extracts filename from `avatar_url`
   - Deletes physical file from `uploads/` folder
   - Sets `avatar_url` to `null` in database
   - Returns success with updated user
7. Frontend refreshes profile
8. Default generated avatar is displayed (from `generateAvatarUrl()`)

### File Deletion Logic:

```javascript
// Example URL: http://192.168.0.100:4000/uploads/1234567890.jpg
const urlParts = user.avatar_url.split("/");
const filename = urlParts[urlParts.length - 1]; // "1234567890.jpg"

const uploadsDir = path.join(__dirname, "../../uploads");
const filePath = path.join(uploadsDir, filename); // "Backend/uploads/1234567890.jpg"

await fs.unlink(filePath); // Delete the file
```

### Default Avatar Display:

- When `avatar_url` is `null`, `generateAvatarUrl()` creates a default avatar
- Uses UI Avatars API with user's initials
- Consistent gradient colors based on name
- Professional appearance

## API Endpoint

### DELETE `/api/auth/avatar`

**Authentication Required**: Yes (JWT token)

**Request**:

```
DELETE /api/auth/avatar
Headers:
  Authorization: Bearer <jwt_token>
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Avatar removed successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    ...
  }
}
```

**Error Responses**:

- `404`: User not found
- `500`: Server error (file deletion or database update failed)

## Testing

### Manual Testing Steps:

1. **Setup**: Ensure user has a profile picture uploaded
2. **Navigate**: Go to Profile screen
3. **Action**: Tap profile picture → "Remove Photo"
4. **Verify Alert**: Confirm message mentions file deletion
5. **Confirm**: Tap "Remove"
6. **Check UI**: Default avatar should appear immediately
7. **Check Backend**: Verify file no longer exists in `Backend/uploads/`
8. **Check Database**: Verify `avatar_url` is `null` in MongoDB

### Expected Behavior:

- ✅ File is deleted from uploads folder
- ✅ Database field is reset to null
- ✅ UI shows default generated avatar
- ✅ No orphaned files remain
- ✅ Success message appears
- ✅ Profile refreshes automatically

### Edge Cases Handled:

- File already deleted: Backend continues and only updates database
- Invalid URL format: Backend catches parse error and continues
- User has no avatar: Backend safely handles null `avatar_url`
- Network error: Frontend shows error alert

## Benefits

1. **Disk Space Management**: Prevents accumulation of orphaned files
2. **Data Consistency**: Ensures database and file system stay in sync
3. **User Experience**: Clear feedback and immediate UI update
4. **Error Handling**: Graceful degradation if file doesn't exist
5. **Security**: Authentication required, user can only delete own avatar

## Files Modified Summary

| File                                         | Changes                                                |
| -------------------------------------------- | ------------------------------------------------------ |
| `Backend/src/controllers/auth.controller.js` | Added file system imports, `deleteAvatar()` function   |
| `Backend/src/routes/auth.routes.js`          | Added DELETE `/avatar` route                           |
| `CampusLink-main/lib/api.js`                 | Added `removeAvatar()` API function                    |
| `CampusLink-main/utils/avatarHelper.js`      | Added `removeProfileAvatar()` helper                   |
| `CampusLink-main/screens/ProfileScreen.js`   | Updated `handleRemovePhoto()` to use new deletion flow |

## Console Logs

Backend logs when avatar is deleted:

```
[Auth] Delete avatar request received for user: <userId>
[Auth] Attempting to delete file: <filePath>
[Auth] ✓ File deleted successfully: <filename>
[Auth] ✓ Avatar removed for user: <email>
```

Frontend logs:

```
[ProfileScreen] Removing avatar...
[ProfileScreen] Avatar removed successfully
```

## Next Steps (Optional Enhancements)

- Add batch cleanup script to remove orphaned files
- Add image optimization before upload (reduce file size)
- Add file type validation (only allow images)
- Add file size limits
- Add recycle bin feature (soft delete with 30-day retention)
- Add avatar history/versioning
