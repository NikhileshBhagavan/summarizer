# summarizer

summarizer is a web based application which helps people realise the important points from the insanely long terms and condition texts which is found at many places these days.

used graphical representations with flash cards for better understanding.

## Allowed input formatst
  * pdf 
  * images/*
  * text

## Internal working
 * used google cloud's Optical Character Recognition (OCR) api for converting image to text.
 * used google cloud's document tet detection api for converting pdf to text.
 * used chatGPT api to mine the important points from the recognised text.
 * used flash cards to graphical represent the important points.

## Video demo
