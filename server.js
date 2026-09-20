const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'notes.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
function readNotes(){ return JSON.parse(fs.readFileSync(dataFile,'utf8')); }
function writeNotes(notes){ fs.writeFileSync(dataFile, JSON.stringify(notes,null,2)); }
app.get('/notes',(req,res)=>res.json(readNotes()));
app.post('/notes',(req,res)=>{
  const {title,content}=req.body;
  if(!title || !content) return res.status(400).json({message:'Title and content are required.'});
  const notes=readNotes();
  const note={id:Date.now().toString(),title:title.trim(),content:content.trim(),createdAt:new Date().toISOString()};
  notes.unshift(note); writeNotes(notes); res.status(201).json(note);
});
app.delete('/notes/:id',(req,res)=>{
  const notes=readNotes();
  const updated=notes.filter(n=>n.id!==req.params.id);

  if(updated.length===notes.length)
    return res.status(404).json({message:'Note not found.'});

  writeNotes(updated);
  res.json({message:'Note deleted successfully.'});
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Quick Note Application running on port ${PORT}`);
});

