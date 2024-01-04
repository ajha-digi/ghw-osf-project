import React from 'react';

const EditIcon = props => {
  const {height = '', width = '', color = ''} = props;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.8125 17.5C21.0312 17.5 21.25 17.7188 21.25 17.9375L21.168 21C21.168 21.9844 20.4023 22.75 19.4453 22.75H10.7227C9.76562 22.75 9 21.9844 9 21V12.25C9 11.293 9.76562 10.5 10.7227 10.5H13.8125C14.0312 10.5 14.25 10.7188 14.25 10.9375C14.25 11.1836 14.0312 11.375 13.8125 11.375H10.75C10.2578 11.375 9.875 11.7852 9.875 12.25V21C9.875 21.4922 10.2578 21.875 10.75 21.875H19.5C19.9648 21.875 20.375 21.4922 20.375 21V17.9375C20.375 17.7188 20.5664 17.5 20.8125 17.5ZM22.5898 9.92578C23.1094 10.418 23.1094 11.2656 22.5898 11.7852L16.0547 18.3203C15.8086 18.5664 15.5078 18.7305 15.1523 18.8125L12.8828 19.25C12.8555 19.25 12.8281 19.2773 12.8008 19.2773C12.6094 19.2773 12.4453 19.0859 12.5 18.8672L12.9375 16.5977C13.0195 16.2422 13.1836 15.9414 13.4297 15.6953L19.9648 9.16016C20.2383 8.88672 20.5664 8.75 20.8945 8.75C21.25 8.75 21.5781 8.88672 21.8242 9.16016L22.5898 9.92578ZM15.4258 17.6914L20.3203 12.8242L18.9258 11.4297L14.0586 16.3242C13.9219 16.4336 13.8398 16.5977 13.8125 16.7617L13.5117 18.2109L14.9883 17.9102C15.1523 17.8828 15.3164 17.8008 15.4258 17.6914ZM21.9883 11.1562C22.0977 11.0469 22.125 10.9102 22.125 10.8555C22.125 10.7734 22.0977 10.6367 21.9883 10.5273L21.2227 9.76172C21.1133 9.65234 20.9766 9.65234 20.8945 9.65234C20.8398 9.65234 20.7031 9.65234 20.5938 9.76172L19.5273 10.8281L20.9219 12.2227L21.9883 11.1562Z" fill="#344054"/>
    </svg>
  );
};

export default EditIcon;
