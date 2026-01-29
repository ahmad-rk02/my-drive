import React from 'react';
import Dropzone from 'react-dropzone';

const DropZone = ({ children, onDrop }) => {
    return (
        <Dropzone onDrop={onDrop} noClick noKeyboard>
            {({ getRootProps, isDragActive }) => (
                <div {...getRootProps()} className={`relative ${isDragActive ? 'border-4 border-primary bg-blue-50' : ''}`}>
                    {children}
                    {isDragActive && <div className="absolute inset-0 flex items-center justify-center">Drop here</div>}
                </div>
            )}
        </Dropzone>
    );
};
export default DropZone;