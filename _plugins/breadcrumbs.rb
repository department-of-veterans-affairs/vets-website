module Jekyll
  class BreadcrumbsTag < Liquid::Tag

    def humanize(s)
      s.split("-").collect do |s|
        s.capitalize
      end.join(" ")
    end

    def render(context)
      breadcrumbs = []
      page_path = context['page']['url']
      parents = page_path.split("/")[1..-2]
      if parents.length > 1
        1.upto(parents.size - 1) do |index|
          parent_path = parents.first(index).join("/")
          breadcrumbs << "<li class=\"parent\"><a href=\"/#{parent_path}/\">#{humanize(parents[index - 1])}</a></li>"
        end
      end
      page_title = context['page']['title']
      breadcrumbs << "<li class=\"active\">#{page_title}</li>"
      breadcrumbs.join("\n")
    end
  end
end

Liquid::Template.register_tag('breadcrumbs', Jekyll::BreadcrumbsTag)