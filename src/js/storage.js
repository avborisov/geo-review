export default  {

}
const LOCAL_STORAGE_ALL_FRIENDS_NAME = 'all_friends';
export const LOCAL_STORAGE_SELECTED_FRIENDS_NAME = 'selected_friends';

export const TMP_ALL_FRIENDS_NAME = 'tmp_all_friends';
export const TMP_SELECTED_FRIENDS_NAME = 'tmp_selected_friends';

// global temporary storage
var tmpAllFriendsStorage = [];
var tmpSelectedFriendsStorage = [];

export function getAllFriendsFromStorage() {
    let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_FRIENDS_NAME));
    return result == null ? new Array() : result;
}

export function getSelectedFriendsFromStorage() {
    let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_FRIENDS_NAME));
    return result == null ? new Array() : result;
}

export function removeFriendFromTmp(storageName, index) {
    let newFriendsArray =
        storageName == TMP_ALL_FRIENDS_NAME ? tmpAllFriendsStorage : tmpSelectedFriendsStorage;
    let deleted = newFriendsArray.splice(index, 1)[0];
    localStorage.setItem(storageName, JSON.stringify(newFriendsArray));

    return deleted;
}

export function addFriendToTmp(storageName, friend) {
    let newFriendsArray =
        storageName == TMP_ALL_FRIENDS_NAME ? tmpAllFriendsStorage : tmpSelectedFriendsStorage;
    newFriendsArray.push(friend) - 1;
    localStorage.setItem(storageName, JSON.stringify(newFriendsArray));
}