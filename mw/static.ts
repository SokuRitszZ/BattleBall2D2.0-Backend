import express from 'express';
import path from 'path';

function useStatic() {
  return [
    express.static(path.resolve('build/public')),
    express.static('build/public'),
  ];
}

export default useStatic;
