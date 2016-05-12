module Jekyll
  class BreadcrumbsTag < Liquid::Tag
  
    def humanize(s)
      # Words that shouldn't get capitalized
      filterwords = ['a', 'a', 'an', 'and', 'as', 'but', 'for', 'for', 'nor', 'or', 'the', 'to']   
      s.split("-").collect do |s|
        # if s is not in filterwords array, capitalize it
        # otherwise just return s.
        if !filterwords.include? s
          s.capitalize
        else
          s
        end
      end.join(" ")
    end

    def render(context)
      breadcrumbs = []
      page_path = context['page']['url']
      parents = page_path.split("/")[1..-2]
      if parents.length > 1
        1.upto(parents.size - 1) do |index|
          parent_path = parents.first(index).join("/")
          if context['page']["breadcrumb_#{index}"]
            breadcrumbs << "<li class=\"parent\"><a href=\"/#{parent_path}/\">#{context['page']["breadcrumb_#{index}"]}</a></li>"
          else
            breadcrumbs << "<li class=\"parent\"><a href=\"/#{parent_path}/\">#{humanize(parents[index - 1])}</a></li>"
          end
        end
      end
      page_title = context['page']['title']
      breadcrumbs << "<li class=\"active\">#{page_title}</li>"
      breadcrumbs.join("\n")
    end
  end
end

Liquid::Template.register_tag('breadcrumbs', Jekyll::BreadcrumbsTag)