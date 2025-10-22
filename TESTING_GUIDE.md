# Quick Testing Guide - Avatar Deletion Feature

## Prerequisites

- Backend server running on port 4000
- Frontend running on Expo
- User logged in with a profile picture uploaded

## Test Steps

### Test 1: Normal Avatar Deletion

1. Open Profile Screen
2. Tap on profile picture
3. Select "Remove Photo"
4. Confirm deletion in alert
5. **Expected**:
   - Success alert appears
   - Default avatar is displayed
   - File deleted from `Backend/uploads/`
   - `avatar_url` is `null` in database

### Test 2: Delete Non-Existent File

1. Manually delete the file from `Backend/uploads/` folder
2. Go to Profile Screen
3. Tap profile picture → "Remove Photo"
4. **Expected**:
   - Still succeeds (no error)
   - Database updated to `avatar_url: null`
   - Default avatar displayed

### Test 3: User Without Avatar

1. Login as user with no profile picture
2. Try to remove photo (if button exists)
3. **Expected**:
   - Operation completes without error
   - Default avatar remains

### Test 4: Network Error Handling

1. Stop backend server
2. Try to remove photo
3. **Expected**:
   - Error alert displayed
   - No changes to UI
   - Loading state stops

## Verification Commands

### Check if file exists (Windows):

```bash
dir Backend\uploads
```

### Check MongoDB (if you have mongo shell):

```javascript
use campuslink
db.users.findOne({ email: "user@example.com" }, { avatar_url: 1 })
// Should show: { avatar_url: null }
```

### Check backend logs:

Look for these messages in backend console:

```
[Auth] Delete avatar request received for user: <id>
[Auth] Attempting to delete file: <path>
[Auth] ✓ File deleted successfully: <filename>
[Auth] ✓ Avatar removed for user: <email>
```

### Check frontend logs:

Look for these in Expo console:

```
[ProfileScreen] Removing avatar...
[ProfileScreen] Avatar removed successfully
```

## Common Issues & Solutions

### Issue: "Failed to remove profile picture"

**Solution**: Check backend logs for error details. Ensure backend is running.

### Issue: File not deleted from uploads folder

**Solution**:

1. Check file permissions on `Backend/uploads/` folder
2. Verify file path construction in backend logs
3. Ensure `avatar_url` format matches expected pattern

### Issue: Default avatar not showing

**Solution**:

1. Check `generateAvatarUrl()` function is imported
2. Verify profile refresh is called
3. Check for console errors in frontend

### Issue: Database not updating

**Solution**:

1. Check MongoDB connection
2. Verify user ID is correct
3. Check backend logs for database errors

## Manual File Cleanup (if needed)

If orphaned files accumulate in `Backend/uploads/`:

```bash
# List all files
cd Backend/uploads
dir /b

# Compare with database avatar_urls
# Delete orphaned files manually or create cleanup script
```

## Success Criteria

✅ File deleted from disk
✅ Database updated (avatar_url = null)
✅ UI shows default avatar
✅ Success message displayed
✅ No errors in console
✅ Profile refreshes automatically

## API Testing (Optional)

Using curl or Postman:

```bash
# Get your JWT token first (from login)
TOKEN="your_jwt_token_here"

# Delete avatar
curl -X DELETE http://localhost:4000/api/auth/avatar \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
{
  "success": true,
  "message": "Avatar removed successfully",
  "user": {
    "id": "...",
    "avatar_url": null,
    ...
  }
}
```

## Rollback (if needed)

If something goes wrong and you need to revert:

1. **Backend routes**: Remove `deleteAvatar` import and route
2. **Backend controller**: Remove `deleteAvatar` function and fs imports
3. **Frontend api.js**: Remove `removeAvatar` function
4. **Frontend avatarHelper**: Remove `removeProfileAvatar` function
5. **Frontend ProfileScreen**: Revert `handleRemovePhoto` to old version

All changes are isolated and can be easily reverted.
