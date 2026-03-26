const team=require("../models/teammodel.js");

const leavemiddleware=(req,res,next)=>{

    const userid=req.user.id;
    const teamid=req.params.id;
    const search=team.findById(teamid);
    if(!search){
        return res.stauts(400).json({
            message:"team don't exists"
        })
    };
    const member=search.member.find(
          (m) => {m.user.toString() === userid}
    )
    if(member.role === "leader"){
        return res.status(403).json({
            message:"Leader cannot leave team. Transfer leadership first"
        });
    }


    next();
}

module.exports={leavemiddleware};