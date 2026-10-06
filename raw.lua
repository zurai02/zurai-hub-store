-- Zurai Hub Pure Lua Dynamic Router
return function(targetId)
    local HttpService = game:GetService("HttpService")
    local rawBaseUrl = "https://githubusercontent.com"
    
    local success, response = pcall(function()
        return game:HttpGet(rawBaseUrl .. "posts.json")
    end)
    
    if not success or not response then
        warn("[Zurai-Hub Error]: Failed to fetch posts.json index array over the network configuration pipeline.")
        return
    end
    
    local decodeSuccess, scriptList = pcall(function()
        return HttpService:JSONDecode(response)
    end)
    
    if not decodeSuccess then
        warn("[Zurai-Hub Error]: posts.json contains string syntax structure errors.")
        return
    end
    
    local matchedScript = nil
    for _, script in pairs(scriptList) do
        if script.id == targetId then
            matchedScript = script
            break
        end
    end
    
    if matchedScript and matchedScript.content then
        local runSuccess, runError = pcall(function()
            local func = loadstring(matchedScript.content)
            if func then func() else error("Compilation error inside system loadstring runtime wrapper.") end
        end)
        if not runSuccess then
            warn("[Zurai-Hub Error]: Runtime exception in execution: " .. tostring(runError))
        end
    else
        warn("[Zurai-Hub Error]: Script target ID '" .. tostring(targetId) .. "' not found in dataset mapping layout.")
    end
end
