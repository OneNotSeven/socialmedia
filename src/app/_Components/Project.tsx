"use client"
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { RemoveAnotherProfile, updateAnotherProfile } from '@/controllers/controller'
interface Project {
    id: number
    projectname: string
    projectdesc: string
    projectlink: string
  }

const Project = ({ profileInfo, userId }:any) => {

    const [projects, setProjects] = useState<any>([])
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({ projectname: "", projectdesc: "", projectlink: "" })
  const [loading, setloading] = useState<boolean>()
  
   useEffect(() => {
   setProjects(profileInfo.projects)
   }, [])
   
  const changesSaved = async () => {
      try {
        
        if (newProject.projectname!="" && newProject.projectdesc!=""&&newProject.projectlink!="") {
          setloading(true)
          
          const changeProcess = await updateAnotherProfile(userId, newProject,"projects")
          if (changeProcess.success == true) {
            setProjects(changeProcess.data[0].projects)
          }
        
          
        }
      } catch (error) {
        console.log("something went wrong")
        
      } finally {
        setloading(false)
      }
    
     
    }
    
    const removeProject = async(removeID:string) => {
      setProjects((prevPro: any[]) => prevPro.filter((skill) => skill._id !== removeID));
      
      const removeProcess=await RemoveAnotherProfile(userId,removeID,"projects")
  }
  
  return (
    <section id="projects" className="mb-8 w-full">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Projects</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            value={newProject.projectname}
            onChange={(e) => setNewProject({ ...newProject, projectname: e.target.value })}
            placeholder="My Awesome Project"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-link">Project Link</Label>
          <Input
            id="project-link"
            value={newProject.projectlink}
            onChange={(e) => setNewProject({ ...newProject, projectlink: e.target.value })}
            placeholder="https://github.com/yourusername/project"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-description">Project Description</Label>
        <Textarea
          id="project-description"
          value={newProject.projectdesc}
          onChange={(e) => setNewProject({ ...newProject, projectdesc: e.target.value })}
          placeholder="Describe your project"
        />
      </div>
      <Button onClick={changesSaved}>Add Project</Button>
    </div>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project:any) => (
        <Card key={project._id}>
          <CardHeader>
            <CardTitle>{project.projectname}</CardTitle>
            <CardDescription>
              <a
                href={project.projectlink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Project
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{project.projectdesc}</p>
            <Button variant="destructive" size="sm" className="mt-2" onClick={() => removeProject(project._id)}>
              Remove Project
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
  )
}

export default Project